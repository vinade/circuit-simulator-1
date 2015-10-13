import React from 'react';
import createFragment from 'react-addons-create-fragment';
import R from 'ramda';
import CircuitComponents from '../../diagram/components';

import Button from './Button.js';
import ButtonGroup from './ButtonGroup.js';
import Mouse from './art/Mouse.js';

const { PropTypes } = React;

const baseButtons = {
  move: {
    name: 'Move',
    art: Mouse
  }
};

function camelToSpace(string) {
  return R.replace(/([a-z\d])([A-Z])/g, '$1 $2', string);
}

const BUTTONS = R.reduce((buttons, component) => {
  return R.assoc(component.typeID, {
    name: camelToSpace(component.typeID),
    art: component
  }, buttons);
}, baseButtons, R.values(CircuitComponents));

const GROUPS = {
  mouse: {
    name: 'Mouse',
    buttons: ['move']
  },
  components: {
    name: 'Components',
    buttons: R.keys(CircuitComponents)
  }
};

export default class ComponentSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedButton: 'move'
    };
    this.toButtonGroups = this.toButtonGroups.bind(this);
    this.toButtons = this.toButtons.bind(this);
  }

  getChildContext() {
    return { disableCurrent: true };
  }

  toButtons(buttonIDs) {
    const { onButtonClicked } = this.props;
    const { selectedButton } = this.state;

    const onButtonClick = buttonID => {
      this.setState({
        selectedButton: buttonID
      });
      onButtonClicked(buttonID);
    };

    const createButton = buttonID => {
      const props = R.pipe(
        R.assoc('id', buttonID),
        R.assoc('onClick', onButtonClick)
      )(BUTTONS[buttonID]);
      return <Button {...props} selected={ selectedButton === buttonID } key={ buttonID }/>;
    };
    return R.map(createButton, buttonIDs);
  }

  toButtonGroups(groupProperties) {
    const buttons = this.toButtons(groupProperties.buttons);

    return (
      <ButtonGroup
        key={ groupProperties.name }
        name={ groupProperties.name }
        >
        {buttons}
      </ButtonGroup>
    );
  }

  render() {
    const groups = createFragment(R.mapObj(this.toButtonGroups, GROUPS));

    return (
      <div style={ this.props.style }>
        { groups }
      </div>
    );
  }
}

ComponentSelector.propTypes = {
  style: PropTypes.object,

  onButtonClicked: PropTypes.func.isRequired
};

ComponentSelector.defaultProps = {
  onButtonClicked: (/* buttonID */) => {}
};

ComponentSelector.childContextTypes = {
  disableCurrent: React.PropTypes.bool.isRequired
};