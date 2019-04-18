import React, { PureComponent } from 'react';
import classNames from 'classnames';
import timeout from 'await-timeout';
import Button from './Button';
import constants from './constants';
import {randomColor} from './utility';

import './assets/Simon.css';

const initialState = {
    targetSequence: [],
    userSequence: [],
    litColor: null,
    buildingTargetSequence: false,    
};

export default class Simon extends PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {...initialState};

        this.next = this.next.bind(this);
        this.press = this.press.bind(this);
        this.light = this.light.bind(this);
        this.reinitialize = this.reinitialize.bind(this);
        this.gameOver = this.gameOver.bind(this);

        this.audios = {};
        this.audios[constants.yellow] = new Audio(`./audio/${constants.yellow}.mp3`);
        this.audios[constants.blue] = new Audio(`./audio/${constants.blue}.mp3`);
        this.audios[constants.green] = new Audio(`./audio/${constants.green}.mp3`);
        this.audios[constants.red] = new Audio(`./audio/${constants.red}.mp3`);
        this.audios.fail = new Audio('./audio/fail.mp3');

        const sounds = [constants.red, constants.blue, constants.yellow, constants.green, constants.fail];
        
        this.soundsHack = {};
    }

    async next() {
        this.setState({
            buildingTargetSequence: true,
        });

        const targetSequence = [...this.state.targetSequence];
        const color = randomColor();

        targetSequence.push(color);

        this.setState({
            targetSequence,
        });

        for (let i = 0; i < targetSequence.length; i++) {
            await this.light(targetSequence[i]);
        }

        this.setState({
            buildingTargetSequence: false,
        });
    }

    async gameOver(color) {
        const audio = this.audios.fail;
        audio.play();
        this.setState({
            litColor: color,
        });

        await timeout.set(constants.failLitDuration);
        this.setState({
            litColor: null,
        });
        await timeout.set(constants);

        this.reinitialize();
    }

    async press(color) {
        const { targetSequence, buildingTargetSequence, litColor } = this.state;
        const userSequence = [...this.state.userSequence];

        if (targetSequence.length === 0 || buildingTargetSequence || litColor || targetSequence.length === userSequence.length) {
            return;
        }

        // IOS allows only one sound to play per click.  We are hacking around that by playing and immediately pausing each
        // sound on a click.    
        const nextKey = Object.keys(this.audios).find(key => !this.soundsHack[key]);
        if (nextKey) {
            this.soundsHack[nextKey] = true;
            this.audios[nextKey].play();
            this.audios[nextKey].pause();
        }        

        userSequence.push(color);

        for (let i = 0; i < userSequence.length; i++) {
            if (targetSequence[i] !== userSequence[i]) {
                this.gameOver(targetSequence[i]);
                return;
            }
        }

        this.setState({
            userSequence,
        });

        await this.light(color);

        if (userSequence.length === targetSequence.length) {
            await timeout.set(1000);
            this.setState({
                userSequence: [],
            });
            this.next();        
        }
    }

    async light(color, callback) {
        console.log(`Lighting ${color}`);
        const audio = this.audios[color];
        audio.play();
        this.setState({
            litColor: color,
        });

        await timeout.set(constants.litDuration);
        this.setState({
            litColor: null,
        });
        await timeout.set(constants.litDuration);

        if (callback) {
            callback();
        }
    }

    reinitialize() {
        this.setState({...initialState});
    }

    render() {
        const { litColor, targetSequence, userSequence } = this.state;

        return (
            <div className="simon">
                <button className={classNames('go', {hide: targetSequence.length > 0})} onClick={() => this.next()}>GO!</button>
                <Button 
                    color={constants.yellow} 
                    lit={litColor === constants.yellow}
                    onPress={this.press} 
                />
                <Button 
                    color={constants.green} 
                    lit={litColor === constants.green}
                    onPress={this.press} 
                />
                <Button 
                    color={constants.red} 
                    lit={litColor === constants.red}
                    onPress={this.press} 
                />
                <Button 
                    color={constants.blue} 
                    lit={litColor === constants.blue}
                    onPress={this.press} 
                />
            </div>
        );
    }
}
