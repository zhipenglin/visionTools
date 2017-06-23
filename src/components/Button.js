import React, {PureComponent} from 'react'
import classnames from 'classnames'
import './button.scss'

export default class extends PureComponent {
    static defaultProps = {
        disabled: false
    };
    state = {
        active: false
    };

    constructor() {
        super();
        this.handlerMouseDown = this.handlerMouseDown.bind(this);
        this.handlerMouseUp = this.handlerMouseUp.bind(this);
        this.handlerClick = this.handlerClick.bind(this);
        this.handlerMouseLeave = this.handlerMouseLeave.bind(this);
    }

    handlerMouseDown(e) {
        this.setState({active: true});
        const {onMouseDown} = this.props;
        onMouseDown && onMouseDown(e);
    }

    handlerMouseUp(e) {
        this.setState({active: false});
        const {onMouseUp} = this.props;
        onMouseUp && onMouseUp(e);
    }

    handlerMouseLeave(e) {
        this.setState({active: false});
        const {onMouseLeave} = this.props;
        onMouseLeave && onMouseLeave(e);
    }

    handlerClick(e) {
        const {disabled, onClick} = this.props;
        if (disabled) {
            return;
        }
        onClick && onClick(e);
    }

    render() {
        const {className, disabled, children, ...other} = this.props;
        return (
            <div className={classnames("c-button", {
                "c-button--active": this.state.active && !disabled,
                "c-button--disabled": disabled
            }, className)} {...other} onMouseDown={this.handlerMouseDown} onMouseUp={this.handlerMouseUp}
                 onMouseLeave={this.handlerMouseLeave} onClick={this.handlerClick}>{children}</div>
        );
    }
}