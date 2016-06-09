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
from app import secret_config
import stripe

@App.route('/sale/sku', methods=['GET'])
def get_sku_prices():
    stripe.api_key = secret_config.stripe_api_key
    divisions = Division.query.all()
    product_list = stripe.Product.list()
    items = product_list['data']
    dict_sku_prices={}
    dict_div_to_sku={}
    for item in items:        
        dict_sku_prices[item['skus']['data'][0]['id']]=item['skus']['data'][0]['price']/100    
    for division in divisions:
        dict_div_to_sku[division.division_id]=dict_sku_prices[division.stripe_sku]
    return jsonify(dict_div_to_sku)
    
@App.route('/sale', methods=['POST'])
def start_sale():    
    token = json.loads(request.data)['stripeToken']
    added_tokens = json.loads(request.data)['addedTokens']
    email = json.loads(request.data)['email']    
    stripe.api_key = secret_config.stripe_api_key
    division_skus={}
    for division in Division.query.all():        
        division_skus[division.division_id]=division.stripe_sku
    stripe_items=[]
    for division_id,num_tokens in added_tokens['divisions'].iteritems():        
        if int(num_tokens) > 0:
            stripe_items.append({"quantity":int(num_tokens),"type":"sku","parent":division_skus[int(division_id)]})
    try:
        order = stripe.Order.create(
            currency="usd",
            email=email,
            items=stripe_items
        )
        order_response=order.pay(
            source=token 
        )
        return jsonify({"result":"success"})
    except stripe.error.CardError as e:
        # The card has been declined
        print "UH OH"
        return jsonify({"result":"FAILURE"})        
        
