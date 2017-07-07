import React, {PureComponent} from 'react'
import classnames from 'classnames'
import './coordinate.scss'

export default class extends PureComponent {
    static displayName = 'Coordinate';
    state = {
        x: 0,
        y: 0
    };

    constructor() {
        super();
        this.handlerMouseMove = this.handlerMouseMove.bind(this);
        this.handlerMouseLeave = this.handlerMouseLeave.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handlerMouseMove);
        document.addEventListener('mouseleave', this.handlerMouseLeave);
        document.body.classList.add('vt-coordinate-cursor');
    }

    componentWillUnmount() {
        document.body.classList.remove('vt-coordinate-cursor');
    }

    handlerMouseLeave() {
        this.setState({
            x: 0,
            y: 0
        });
    }

    handlerMouseMove(e) {
        this.setState({
            x: e.clientX,
            y: e.clientY
        });
    }

    render() {
        const {degree}=this.props;
        return (
            <div className="c-coordinate">
                <div className={classnames({
                    "c-coordinate__line":degree,
                    "c-coordinate__line--disabled":!degree
                })} style={{width: `${this.state.x}px`, height: `${this.state.y}px`}}>
                    <div className="c-coordinate__pointer">
                        {this.state.x > 0 && this.state.y > 0 ?
                            <div className="c-coordinate__pointer-text">({this.state.x},{this.state.y})</div> : null}
                    </div>
                </div>
            </div>
        );
    }
}