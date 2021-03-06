import React, { Component } from 'react';
import '../assets/css/Nav.css';
import Fa from '@fortawesome/react-fontawesome';

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.navigateViews = this.navigateViews.bind(this);
        this.logout = this.logout.bind(this);
    }
    navigateViews (navName) {
        this.props.navigateViews(navName);
    }
    logout () {
        this.props.logout();
    }
    render () {
        let navItems = [];
        const that = this;
        this.props.items.forEach((item, x) => {
            navItems.push(<li className="nav-list-item" key={x} onClick={this.navigateViews.bind(this, item.navName)}>{item.navName}</li>);
            if (x + 1 < that.props.items.length) {
                navItems.push(<li key={that.props.items.length+x} className="nav-list-item icon"><Fa icon="angle-right"/></li>);
            }
        });
        return (
            <div id="nav">
                <ul id="nav-list">
                    {navItems}
                </ul>
                <Fa id="nav-logout" icon="sign-out-alt" onClick={this.logout.bind(this)} />
            </div>
        );
    }
}

export default Nav;
