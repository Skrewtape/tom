import json
from sqlalchemy import null
from flask import jsonify, request
from flask_login import login_required
from app import App
from app.types import Player, Division, Entry, Score, Tournament, Team
from app import App, Admin_permission, Desk_permission, DB
from app.routes.util import fetch_entity, calculate_score_points_from_rank
from werkzeug.exceptions import Conflict
from flask_restless.helpers import to_dict
import stripe

@App.route('/sale', methods=['POST'])
def start_sale():    
    token = json.loads(request.data)['stripeToken']
    added_tokens = json.loads(request.data)['addedTokens']
    email = json.loads(request.data)['email']    
    stripe.api_key = "sk_test_1MlFJc2DzIUwgi3u1A04m5YQ"
    b_division_sku = "sku_8bU4ZwvW1UMtxy" 
    try:
        order = stripe.Order.create(
            currency="usd",
            email=email,
            items=[
                {
                    "amount":1,
                    "type":'sku',
                    "parent":b_division_sku
                }]
        )
        order_response=order.pay(
            source=token 
        )
        return jsonify({"result":"success"})
    except stripe.error.CardError as e:
        # The card has been declined
        print "UH OH"
        return jsonify({"result":"FAILURE"})        
        
