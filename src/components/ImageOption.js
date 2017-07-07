import React, {PureComponent} from 'react'
import classnames from 'classnames'
import Button from './Button'
import Range from './Range'
import './option.scss'

export default class extends PureComponent {
    static displayName = 'ImageOption';

    dataChange(name, value) {
        const {data, onChange} = this.props;
        onChange && onChange(Object.assign({}, data, {
            [name]: value
        }));
    }

    render() {
        const {data,className} = this.props;
        return (
            <div className={classnames(className,{
                "c-option": !data.locked,
                "c-option--close": data.locked
            })}>
                <Button className={classnames({
                    "c-option__locked": !data.locked,
                    "c-option__locked--close": data.locked
                })} onClick={this.dataChange.bind(this, 'locked', !data.locked)}/>
                <div className="c-option__ranges">
                    <div className="c-option__ranges-item">
                        <Range disabled={data.locked} value={data.opacity}
                               onChange={this.dataChange.bind(this, 'opacity')}/>
                        <div className="c-option__label">透明{data.opacity.toFixed(1)}%</div>
                    </div>
                    <div className="c-option__ranges-item">
                        <Range maxValue={200} disabled={data.locked} value={data.scale} onChange={this.dataChange.bind(this, 'scale')}/>
                        <div className="c-option__label">缩放{data.scale.toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        );
    }
}