import React from 'react';
import { actions } from '../actions';

class Simple extends React.Component {
    constructor(props) {
        super(props);
    }
    action = (e) => {
        const { dispatch } = this.props;
        dispatch(actions.actionCallingApi());
    }
    render() {
        return (
            <div className="simple">
                <h1>Simple component</h1>
                <p>{this.props.foo}</p>
                <p>{this.props.bar}</p>
                <button onClick={this.action}>change state</button>
            </div>
        )
    }
}

export default Simple;
