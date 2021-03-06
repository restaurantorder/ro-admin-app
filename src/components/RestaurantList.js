import React, { Component } from 'react';
import RestaurantListItem from '../components/RestaurantListItem';
import CreateItem from '../components/CreateItem';
import EditPopup from '../components/EditPopup';
import EditPopupHelper from '../library/EditPopupHelper';

import HttpHelper from '../ro-webapp-helper/http';
import ServerConfig from '../serverConfig';

class RestaurantList extends Component {
    constructor (props) {
        super(props);

        this.state = {
            restaurants: [],
            editRestaurant: false,
            editRestaurantData: {}
        };

        // load restaurants
        this.serverCfg = new ServerConfig();
        this.http = new HttpHelper(this.serverCfg.adminApi, this.serverCfg.authApi);

        this.httpPath = '/restaurants?accountId=' + this.props.accountId;
        this.http.get(this.httpPath).then(result => {
            let newState = this.state;
            newState.restaurants = result;
            this.setState(newState);
        }).catch(err => {
            console.log(err);
        });

        // edit restaurants
        this.editPopupHelper = new EditPopupHelper('/restaurant', 'restaurants', {accountId: this.props.accountId});

        this.editRestaurant = this.editRestaurant.bind(this);
        this.editRestaurantClose = this.editRestaurantClose.bind(this);
        this.createRestaurant = this.createRestaurant.bind(this);
        this.updateRestaurant = this.updateRestaurant.bind(this);
        this.deleteRestaurant = this.deleteRestaurant.bind(this);
    }

    editRestaurant (restaurantIndex) {
        let newState = this.state;
        if (restaurantIndex !== undefined) {
            newState.editRestaurantData = Object.assign({}, this.state.restaurants[restaurantIndex]);
            let newFormData = {};
            // format form data
            for (let key in newState.editRestaurantData) {
                if (key !== 'account') {
                    let value = newState.editRestaurantData[key];
                    if (key === 'address') {
                        for (let addrKey in newState.editRestaurantData[key]) {
                            if (addrKey !== 'id') {
                                newFormData[addrKey] = newState.editRestaurantData[key][addrKey];
                            }
                        }
                    } else {
                        newFormData[key] = value;
                    }
                }
            }
            newState.editRestaurantData = newFormData;
        } else {
            newState.editRestaurantData = false;
        }
        newState.editRestaurant = true;
        this.setState(newState);
    }
    editRestaurantClose () {
        let newState = this.state;
        newState.editRestaurantData = false;
        newState.editRestaurant = false;
        this.setState(newState);
    }

    createRestaurant (formData) {
        const that = this;
        this.editPopupHelper.createItem(this.state, formData).then(newState => {
            that.setState(newState);
            that.editRestaurantClose();
        });
    }
    updateRestaurant (id, formData) {
        const that = this;
        this.editPopupHelper.updateItem(this.state, id, formData).then(newState => {
            that.setState(newState);
            that.editRestaurantClose();
        });
    }
    deleteRestaurant (id) {
        const that = this;
        this.editPopupHelper.deleteItem(this.state, id).then(newState => {
            that.setState(newState);
            that.editRestaurantClose();
        });
    }

    render () {
        let editPopup;
        if (this.state.editRestaurant) {
            let formFields = ['name', 'street', 'postCode', 'city', 'country'];
            editPopup = <EditPopup formData={this.state.editRestaurantData} formFields={formFields} create={this.createRestaurant} update={this.updateRestaurant} delete={this.deleteRestaurant} close={this.editRestaurantClose} />;
        }
        var RestaurantElements = [];
        for (var i = 0; i < this.state.restaurants.length; i++) {
            var restaurant = this.state.restaurants[i];
            let selected = false;
            if (this.props.selectedId && this.props.selectedId === restaurant.id) {
                selected = true;
            }
            RestaurantElements.push(<RestaurantListItem key={i} index={i} selected={selected} restaurant={restaurant} select={this.props.selectRestaurant} edit={this.editRestaurant}/>);
        }
        return (
            <div id="restaurant-list" className="restaurant-item">
                <CreateItem text="CREATE RESTAURANT" click={this.editRestaurant.bind(this, undefined)} />
                {RestaurantElements}
                {editPopup}
            </div>
        );
    }
}

export default RestaurantList;
