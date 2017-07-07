import React, {PureComponent} from 'react'
import classnames from 'classnames'
import Button from './Button'
import './image-list.scss'

export default class extends PureComponent {
    static displayName = 'ImagePreview';
    static defaultProps = {
        list: [],
        selectIndex: -1
    };

    handlerClick(key) {
        const {onChange, selectIndex} = this.props;
        if (selectIndex === key) {
            key = -1;
        }
        onChange && onChange(key);
    }

    renderImage() {
        const {list, selectIndex} = this.props;
        return list.map((item, key) => <Button className={classnames({
            "c-image-list__item": key !== selectIndex,
            "c-image-list__item--active": key === selectIndex
        })} key={key} onClick={this.handlerClick.bind(this, key)}>
            <img className="c-image-list__img" src={item}/>
        </Button>);
    }

    render() {
        return (
            <div className="c-image-list">
                {this.renderImage()}
            </div>
        );
    }
}