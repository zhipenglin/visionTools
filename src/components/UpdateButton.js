import React, {PureComponent} from 'react'
import classnames from 'classnames'
import Button from './Button'
import zip from '../utils/zip'

export default class extends PureComponent {
    static displayName = "UpdateButton";

    constructor() {
        super();
        this.handlerChange = this.handlerChange.bind(this);
    }

    handlerChange(e) {
        const {onChange, isZip} = this.props;
        const target = e.target, file = target.files[0];
        if (file) {
            (isZip ? zip(file) : Promise.resolve(file)).then((file) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = (e) => {
                    onChange && onChange(e.target.result);
                };
            });
        }

    }

    render() {
        const {className, onClick, onChange, children, ...others} = this.props;
        return (
            <Button className={classnames(className, "c-update")} {...others}>
                <div className="c-update__file-outer">
                    <input className="c-update__file-input" type="file" onChange={this.handlerChange}/>
                </div>
                {children}
            </Button>
        );
    }
}
