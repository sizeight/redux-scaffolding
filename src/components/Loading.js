import React from 'react';
import PropTypes from 'prop-types';

import './Loading.css';

const propTypes = {
  animate: PropTypes.bool,
  size: PropTypes.oneOf(['1x', '2x', '3x']),
  center: PropTypes.bool,
};

const defaultProps = {
  animate: false,
  size: '1x',
  center: false,
};

const Loading = (props) => {
  const { animate, size, center } = props;

  const wrapperClass = `redux-scaffolding-loader-wrapper${center ? ' redux-scaffolding-loader-center' : ''}`;
  const loaderClass = `redux-scaffolding-loader redux-scaffolding-loader-size-${size}`;

  return (
    <div className={wrapperClass}>
      {animate
        ? (
          <div className={loaderClass} />
        ) : (
          <em>Loading&hellip;</em>
        )}
    </div>
  );
};

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
