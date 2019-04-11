import React, { PureComponent } from 'react';
import ColorTile from './ColorTile';
import classNames from 'classnames';

class GameOver extends PureComponent {
    render() {
        const { targetSequence, userSequence, hide, onClose } = this.props;

        return (
            <div className={classNames('gameOver', { hide })}>
                <div className="gameOverMessage">
                    GAME OVER
                </div>
                <div className="sequence">
                    {targetSequence.map((color, index) => (
                        <ColorTile key={index} color={color} wrong={userSequence[index] !== color} />
                    ))}
                </div>
                <button className="playAgain" onClick={onClose}>
                        PLAY AGAIN!
                </button>
            </div>
        );
    }
}

export default GameOver;
