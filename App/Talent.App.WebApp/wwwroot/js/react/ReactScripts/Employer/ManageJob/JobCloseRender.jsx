import React from 'react';
import { Button } from 'semantic-ui-react';

export default function JobCloseRender(props){
    const { closeStatus, jobCloseClick } = props;

    const closeClicked = () => {
        jobCloseClick();
    }
    return (
        <React.Fragment>
            {closeStatus ?
                <Button
                    className="ui disabled button"
                    icon="cancel"
                    content="Closed" /> :
                <Button
                    basic color="blue"
                    icon="cancel"
                    content="Close"
                    onClick={closeClicked} />
            }
        </React.Fragment>
    )
}