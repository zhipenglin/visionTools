import React, {PureComponent} from 'react'
import classnames from 'classnames'
import Button from './Button'

export default class extends PureComponent {
    static displayName = 'RuleOption';

    dataChange(name, value) {
        const {data, onChange} = this.props;
        onChange && onChange(Object.assign({}, data, {
            [name]: value
        }));
    }

    render() {
        const {data} = this.props;
        return (
            <div className="c-option">
                <Button className={classnames({
                    "c-option__locked": !data.locked,
                    "c-option__locked--close": data.locked
                })} onClick={this.dataChange.bind(this, 'locked', !data.locked)}/>
                <Button className={classnames({
                    "c-option__coordinate": data.coordinate,
                    "c-option__coordinate--close": !data.coordinate
                })} onClick={this.dataChange.bind(this, 'coordinate', !data.coordinate)}/>
                <Button className={classnames({
                    "c-option__degree": data.degree,
                    "c-option__degree--close": !data.degree
                })} onClick={this.dataChange.bind(this, 'degree', !data.degree)}/>
            </div>
        )
    }
}