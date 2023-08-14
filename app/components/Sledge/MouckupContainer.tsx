import React from "react";

export class SledgeDemoContainer extends React.Component {
    render() {
        return <div id={this.props.id} className='mt-20 relative w-auto h-auto mockup-code'>
            {this.props.htmlChildern}
        </div>;
    }
}