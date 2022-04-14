import { NodeImplBuilder } from '@flower/interfaces';
import { html, css, LitElement, PropertyDeclarations } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('simple-greeting-interface')
export class SimpleGreetingInterface extends LitElement {
  static styles = css`p { color: blue }`;

  static properties: PropertyDeclarations = {
    name: { type: String },
  };

  render() {
    return html`<p>Hello, ${this.getAttribute("name")}!</p>`;
  }
}

export const LogImplBuilder: NodeImplBuilder = () => ({
  name: 'Log',
  inputs: [{ id: 'in', dataType: 'string | number | object' }],
  interface: {
    tag: 'simple-greeting-interface',
    customElement: SimpleGreetingInterface,
  }
});
