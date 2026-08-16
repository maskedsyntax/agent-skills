import React from 'react';
import {Composition} from 'remotion';
import {projects} from './projects/registry';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {projects.map((project) => (
        <Composition
          key={project.id}
          id={project.id}
          component={project.component}
          durationInFrames={project.durationInFrames}
          fps={project.fps}
          width={project.width}
          height={project.height}
          defaultProps={project.defaultProps}
        />
      ))}
    </>
  );
};
