module Api
  module V1
    class LineFoodsController < ApplicationController
      # ①before_actionでcreateアクション前に現在のparams[:food_id]を受け取って@ordered_foodというインスタンス変数に代入している
      before_action :set_food, only: %i[create replace]

      # ⑦line_foodを取得する。※.activeとはmodel/line_food.rbのscope :activeの事。モデル名.スコープ名という形で使用する。active: trueなline_foodの一覧が取得できる。
      def index
        line_foods = LineFood.active
        if line_foods.exists?
          render json: {
            line_food_ids: line_foods.map { |line_food| line_food.id},
            restaurant: line_foods[0].restaurant,
            count: line_foods.sum { |line_food| line_food[:count] },
            amount: line_foods.sum { |line_food| line_food.total_amount },
          }, status: :ok
        else
          # 例外パターン（activeなlinefoodが一つも存在しない場合）は空のデータを返す
          render json: {}, status: :no_content
        end
      end
      # line_food_idsではmapメソッドを使用しline_foodに1つずつのidを取得、それがline_food_idsのプロパティになる。
      # restaurantは　line_foods.first.restaurantでも一緒。

      def create
        # ③例外パターン（他店舗での仮注文がすでにある場合）は早期リターンさせる条件分岐。
        if LineFood.active.other_restaurant(@ordered_food.restaurant.id).exists?
          return render json: {
            existing_restaurant: LineFood.other_restaurant(@ordered_food.restaurant.id).first.restaurant.name,
            new_restaurant: Food.find(params[:food_id]).restaurant.name,
          }, status: :not_acceptable
          # 例外パターン（他店舗での仮注文がすでにある場合）はエラーを返す
        end

        # ④set_line_foodアクションを呼び出してline_foodを作成・または更新する
        set_line_food(@ordered_food)

        # ⑥DBに保存する
        if @line_food.save
        render json: {
        line_food: @line_food
        }, status: :created
        else
        render json: {}, status: :internal_server_error
        end
      end

      # activeなlinefood一覧を取得し、each文で各要素に対しupdate_attributeで:activeeをfalseに更新している。
      def replace
        LineFood.active.other_restaurant(@ordered_food.restaurant.id).each do |line_food|
          line_food.update_attribute(:active, false)
        end

        set_line_food(@ordered_food)

        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end

      private
        # ②before_action用のフィルタアクション
        def set_food
          @ordered_food = Food.find(params[:food_id])
        end

        # ⑤line_foodを作成更新するアクション。すでに仮注文があるかをpresent?で分岐しある場合は更新、ない場合は新規作成。
        def set_line_food(ordered_food)
          if ordered_food.line_food.present?
            @line_food = ordered_food.line_food
            @line_food.attributes = {
              count: ordered_food.line_food.count + params[:count],
              active: true
            }
          else
            @line_food = ordered_food.build_line_food(
              count: params[:count],
              restaurant: ordered_food.restaurant,
              active: true
            )
          end
        end

    end
  end
end