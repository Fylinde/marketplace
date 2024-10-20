import React from 'react';

const CartIcon: React.FC = () => {
    return (
        <div className="cart-icons">
            <div className="wishlist">
                <i className="fa fa-heart" />
                <span>0</span>
            </div>
            <div className="cart">
                <i className="fa fa-shopping-bag" />
                <span>2</span>
            </div>
            <div className="total">
                <span>£80.00</span>
            </div>
        </div>
    );
};

export default CartIcon;
