import React, { useEffect, useState } from 'react';
import { isExpectedDataType } from '@/_helpers/utils';
import _ from 'lodash';

export const ButtonGroup = function Button({
  height,
  properties,
  styles,
  fireEvent,
  setExposedVariable,
  darkMode,
  dataCy,
}) {
  const { label, multiSelection } = properties;
  const values = isExpectedDataType(properties.values, 'array');
  const labels = isExpectedDataType(properties.labels, 'array');
  const defaultSelected = isExpectedDataType(properties.defaultSelected, 'array');

  const {
    backgroundColor,
    textColor,
    borderRadius,
    visibility,
    disabledState,
    selectedBackgroundColor,
    selectedTextColor,
  } = styles;

  const computedStyles = {
    backgroundColor,
    color: textColor,
    borderRadius: `${borderRadius}px`,
    display: visibility ? '' : 'none',
  };

  const [defaultActive, setDefaultActive] = useState(defaultSelected);
  const [data, setData] = useState(
    // eslint-disable-next-line no-unsafe-optional-chaining
    values?.length <= labels?.length ? [...labels, ...values?.slice(labels?.length)] : labels
  );
  // data is used as state to show what to display , club of label+values / values
  useEffect(() => {
    setDefaultActive(defaultSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultSelected)]);

  useEffect(() => {
    if (labels?.length < values?.length) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setData([...labels, ...values?.slice(labels?.length)]);
    } else {
      setData(labels);
    }
  }, [JSON.stringify(labels), JSON.stringify(values)]);

  useEffect(() => {
    setDefaultActive(defaultSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiSelection]);

  const buttonClick = (index) => {
    if (defaultActive?.includes(values[index]) && multiSelection) {
      const copyDefaultActive = defaultActive;
      copyDefaultActive?.splice(copyDefaultActive?.indexOf(values[index]), 1);
      setDefaultActive(copyDefaultActive);
      setExposedVariable('selected', copyDefaultActive.join(',')).then(() => fireEvent('onClick'));
    } else if (multiSelection) {
      setExposedVariable('selected', [...defaultActive, values[index]].join(',')).then(() => fireEvent('onClick'));
      setDefaultActive([...defaultActive, values[index]]);
    } else if (!multiSelection) {
      setExposedVariable('selected', [values[index]]).then(() => fireEvent('onClick'));
      setDefaultActive([values[index]]);
    }
    if (values?.length == 0) {
      setExposedVariable('selected', []).then(() => fireEvent('onClick'));
    }
  };
  return (
    <div className="widget-buttongroup" style={{ height }} data-cy={dataCy}>
      {label && (
        <p
          style={{ display: computedStyles.display }}
          className={`widget-buttongroup-label ${darkMode && 'text-light'}`}
        >
          {label}
        </p>
      )}
      <div>
        {data?.map((item, index) => (
          <button
            style={{
              ...computedStyles,
              backgroundColor: defaultActive?.includes(values[index]) ? selectedBackgroundColor : backgroundColor,
              color: defaultActive?.includes(values[index]) ? selectedTextColor : textColor,
              transition: 'all .1s ease',
            }}
            key={item}
            disabled={disabledState}
            className={'group-button overflow-hidden'}
            onClick={(event) => {
              event.stopPropagation();
              buttonClick(index);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
