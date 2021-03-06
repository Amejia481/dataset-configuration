import React from 'react';
import Store from 'd2-ui/lib/store/Store';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import GroupEditor from 'd2-ui/lib/group-editor/GroupEditor.component';

const MultiSelect = React.createClass({
    propTypes: {
        options: React.PropTypes.arrayOf(React.PropTypes.object),
        selected: React.PropTypes.arrayOf(React.PropTypes.string),
        onChange: React.PropTypes.func.isRequired,
        label: React.PropTypes.string,
        errors: React.PropTypes.arrayOf(React.PropTypes.string),
    },

    getInitialState() {
        const availableStore = Store.create();
        const assignedStore = Store.create();
        availableStore.setState(this.props.options);
        assignedStore.setState(this.props.selected);
        return {availableStore, assignedStore};
    },

    componentWillReceiveProps(nextProps) {
        this.state.availableStore.setState(nextProps.options);
        this.state.assignedStore.setState(nextProps.selected);
    },

    getDefaultProps() {
        return {height: 300, options: [], selected: []};
    },

    _onItemAssigned(newItems) {
        const assigned = this.state.assignedStore.state.concat(newItems);
        this.state.assignedStore.setState(assigned);
        this.props.onChange(assigned);
        return Promise.resolve();
    },

    _onItemRemoved(removedItems) {
        const assigned = _.difference(this.state.assignedStore.state, removedItems);
        this.state.assignedStore.setState(assigned);
        this.props.onChange(assigned);
        return Promise.resolve();
    },

    render() {
        const styles = {
            labelStyle: {
                display: 'block',
                width: 'calc(100% - 60px)',
                lineHeight: '24px',
                color: 'rgba(0,0,0,0.3)',
                marginTop: '1rem',
                fontSize: 16,
            },
            errorStyle: {
                color: "red",
            },
        };
        const {errors, label, ...otherProps} = this.props;

        return (
            <div>
                <label style={styles.labelStyle}>
                    {label}
                </label>

                <div>
                    {(errors || []).map((error, idx) => <p key={idx} style={styles.errorStyle}>{error}</p>)}
                </div>

                <GroupEditor
                    itemStore={this.state.availableStore}
                    assignedItemStore={this.state.assignedStore}
                    onAssignItems={this._onItemAssigned}
                    onRemoveItems={this._onItemRemoved}
                    {...otherProps}
                />
            </div>
        );
    },
});

export default MultiSelect;