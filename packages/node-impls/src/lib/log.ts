import { NodeImplBuilder } from '@flower/interfaces';
import {
  html,
  css,
  LitElement,
  PropertyDeclarations,
  PropertyValues,
} from 'lit';

export class LogExplorer extends LitElement {
  static styles = css`
    .container {
      width: 180px;
      text-align: left;
      display: flex;
      flex-direction: column;
      font-size: 8px;
      border: 1px solid black;
      border-radius: 3px;
      height: 150px;
      overflow: auto;
      white-space: nowrap;
      padding: 2px;
    }
    .log-entry {
      color: rgb(42, 42, 151);
      margin-bottom: 1px;
      border-bottom: 1px solid rgb(211, 211, 209);
    }
  `;
  static properties: PropertyDeclarations = {
    input: {
      type: String,
    },
  };
  private logs: Array<{ time: Date; text: string }> = [];

  createLogEntry(text: string) {
    return {
      time: new Date(Date.now()),
      text,
    };
  }

  addLogEntry(text: string | null) {
    if (!text) return;
    const logEntry = this.createLogEntry(text);
    this.logs.push(logEntry);
    this.requestUpdate();
    return logEntry;
  }

  updated(changed: PropertyValues) {
    if (
      changed.has('input') &&
      typeof this.getAttribute('input') === 'string'
    ) {
      this.addLogEntry(this.getAttribute('input'));
    }
  }

  render() {
    return html`
      <div class="container">
        ${this.logs.map(
          (log) =>
            html`<div class="log-entry">
              [${log.time.toLocaleTimeString()}]: ${log.text}
            </div>`
        )}
      </div>
    `;
  }
}

export const LogImplBuilder: NodeImplBuilder = () => ({
  name: 'Log',
  inputs: [{ id: 'in', dataType: 'string | number | object' }],
  interface: {
    tag: 'log-explorer-interface',
    customElement: LogExplorer,
  },
});
