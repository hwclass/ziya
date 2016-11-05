// Core
import React, { Component, PropTypes } from 'react';

// UI
import './Sidebar.css';
import { Treebeard, decorators } from 'react-treebeard';

// Helpers
import isEqual from 'lodash.isequal';

// PropTypes
const propTypes = {
  items: PropTypes.array,
  selectedItem: PropTypes.string,
  handleItemClick: PropTypes.func,
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.formatItemList(props.items),
    };
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.items, this.props.items)) {
      this.setState({
        data: this.formatItemList(nextProps.items),
      });
    }
  }

  onToggle(node, toggled) {
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }

    node.active = true;

    if (node.children) {
      node.toggled = toggled;
    }

    if (node.name !== 'root') {
      this.props.handleItemClick(node);
    }

    this.setState({ cursor: node });
  }

  formatItemList(items) {
    const children = items.map(item => ({
      name: item.name,
      children: item.type === 'directory' && [],
      type: item.type,
    }));

    return {
      name: 'root',
      toggled: false,
      children,
    };
  }

  render() {
    return (
      <div id="Sidebar">
        <Treebeard
          data={this.state.data}
          onToggle={this.onToggle}
          decorators={decorators}
        />
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;

export default Sidebar;
