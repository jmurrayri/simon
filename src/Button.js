import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Button extends PureComponent {
    render() {
        const { color, lit, onPress } = this.props;
        
        return (
            <div className={classNames('button', color, { lit })} onClick={() => onPress(color)} />
        );
    }
}

Button.propTypes = {
    color: PropTypes.string.isRequired,
    lit: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
};
