import React from 'react'
import { advanceWorkflow, log } from './Workflow.actions'
import {
  withRawConfiguration,
  getGlobalProps,
  getComponentAsLoadable,
  getComponentProps,
  getAllPropsForComponent
} from './Workflow'
import { connect } from 'react-redux'

import { UploadOnError } from './UploadOnError'

export const App = ({
  task,
  tasks = [],
  configuration,
  onLog,
  onAdvanceWorkflow,
  getComponentAsLoadable
}) => {
  // TODO: currently order matters, should it?
  if (task) {
    tasks = [...tasks, task]
  }

  if (task) {
    // TODO: Check if the proptypes require a component, if so try resolving one.
    return (
      <UploadOnError onLog={onLog} configuration={configuration}>
        {tasks.map(task => {
          let globalProps = getGlobalProps(configuration)
          let Task = getComponentAsLoadable(
            task,
            getAllPropsForComponent(task, configuration)
          )

          return (
            <Task
              onAdvanceWorkflow={onAdvanceWorkflow}
              getComponentAsLoadable={getComponentAsLoadable}
              {...getComponentProps(task, configuration)}
              {...globalProps}
            />
          )
        })}
      </UploadOnError>
    )
  } else {
    return (
      <div>
        <h1>You've completed the experiment!</h1>;
        <a
          download={`${configuration.participant}.json`}
          href={`data:text/json;charset=utf-8,${JSON.stringify(configuration)}`}
        >
          Download experiment log
        </a>
      </div>
    )
  }
}

// TODO: probably need to refactor this, have the full config passed to app and app choose how to use it.
const mapStateToProps = state => {
  let props = getGlobalProps(state.Configuration)
  return {
    ...props,
    getComponentAsLoadable: componentName =>
      getComponentAsLoadable(componentName, props)
  }
}

const mapDispatchToProps = {
  onAdvanceWorkflow: advanceWorkflow,
  onLog: log
}

export default withRawConfiguration(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
)