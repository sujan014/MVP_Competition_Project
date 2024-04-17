import React from 'react';
import { Button } from 'semantic-ui-react';

export default class JobCloseRender extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            jobCloseStatus: props.closeStatus,
        }
        this.closeClicked = this.closeClicked.bind(this);        
    };        
    closeClicked() {
        this.props.jobCloseClick();
    }
    render() {
        const closeButton = this.state.jobCloseStatus ?
            <Button
                className="ui disabled button"
                icon="cancel"
                content="Closed"
            /> :
            <Button
                basic color="blue"
                icon="cancel"
                content="Close"
                onClick={this.closeClicked}
            />;
        return (
            closeButton
        )
    }
}