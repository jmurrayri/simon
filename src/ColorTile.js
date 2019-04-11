import React, { PureComponent } from 'react';
import classNames from 'classnames';

class ColorTile extends PureComponent {
    render() {
        const { color, wrong } = this.props;

        return (
            <div className={classNames('colorTile', color, 'lit', { wrong })}>
                {wrong ? ':(' : ':)'}
            </div>
        );
    }
}

export default ColorTile;
