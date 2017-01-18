// Core
import React, { Component, PropTypes } from 'react';

// UI
import { Treebeard, decorators } from 'react-treebeard';
import './Sidebar.css';

// Helpers
import isEqual from 'lodash.isequal';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { data: this.formatItemList(props.items) };
    this.onToggle = this.onToggle.bind(this);
    this.getItemListContent = this.getItemListContent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { items, selectedItem } = this.props;

    if (!isEqual(nextProps.items, items) || !isEqual(nextProps.selectedItem, selectedItem)) {
      this.setState({
        data: this.formatItemList(nextProps.items, nextProps.selectedItem),
      });
    }
  }

  onToggle(node, toggled) {
    if (this.state.cursor) {
      const cursor = Object.assign(this.state.cursor, { active: false });
      this.setState({ cursor });
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

  getItemListContent(items, selectedItem, parentPath) {
    const isParentOfSelectedItem = item => (
      item.children &&
      item.children.some(child => child.path === selectedItem.path || isParentOfSelectedItem(child),
    ));

    return items.map((item) => {
      const isSelectedItem = item.path === selectedItem.path && selectedItem.toggled;
      const children = item.type === 'directory' && (
        item.children ? this.getItemListContent(item.children, selectedItem, item.path) : []
      );

      return {
        ...item,
        toggled: isSelectedItem || isParentOfSelectedItem(item),
        children,
        parentPath,
      };
    });
  }

  formatItemList(items, selectedItem) {
    return {
      name: 'root',
      toggled: true,
      children: this.getItemListContent(items, selectedItem, 'root'),
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

Sidebar.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.object,
  handleItemClick: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {
  selectedItem: {},
};

export default Sidebar;
