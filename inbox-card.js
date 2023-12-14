import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class InboxCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      selectedOption: { type: String }
    };
  }

  constructor() {
    super();
    this.selectedOption = 'all';
  }

  render() {
    return html`
      <ha-card header="Inbox">
        <div class="card-content">
          <div class="inbox-options">
            <input type="radio" id="all" name="options" @change=${() => this._selectOption('all')} ?checked=${this.selectedOption === 'all'}>
            <label for="all">All</label><br>

            <input type="radio" id="unread" name="options" @change=${() => this._selectOption('unread')} ?checked=${this.selectedOption === 'unread'}>
            <label for="unread">Unread</label><br>

            <input type="radio" id="read" name="options" @change=${() => this._selectOption('read')} ?checked=${this.selectedOption === 'read'}>
            <label for="read">Read</label><br>
          </div>

          <div class="inbox-messages">
            ${this._displayContent()}
          </div>
        </div>
      </ha-card>
    `;
  }

  _selectOption(option) {
    this.selectedOption = option;
  }

  _displayContent() {
    return html`
      <div>
        ${Object.values(this.hass.states).map((state) => {
          if (state.attributes["Type"] === "conversation" && (this.selectedOption === 'all' || state.state === this.selectedOption)) {
            const icon = state.attributes["icon"]
            const sender = state.attributes["Initial Sender"]
            const content = state.attributes["friendly_name"]
            const date = state.attributes["Last Message Time"]

            return html`
            <div class="message">
              <ha-icon icon=${icon}></ha-icon>
              <div class="message-details">
                <div class="sender-name">${sender}</div>
                <div class="message-content">${content}</div>
                <div class="message-date">${date}</div>
              </div>
            </div>
            `;
          }
        })}
      </div>
    `;
  }

  setConfig(config) {
    // pass
  }

  getCardSize() {
    return 4;
  }

  static get styles() {
    return css`
    .inbox-options {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 16px;
    }

    .inbox-options label {
      display: inline-block;
      position: relative;
      padding: 8px;
      margin: 0 4px;
      cursor: pointer;
    }

    .inbox-options input[type="radio"] {
      display: none;
    }

    .inbox-options input[type="radio"]:checked + label {
      border-bottom: 2px solid var(--primary-color);
    }

    .inbox-options label:hover {
      background-color: var(--secondary-background-color);
    }

    ha-icon {
      margin-right: 8px;
    }

    .message {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .message-details {
      display: flex;
      flex-direction: column;
    }

    .sender-name {
      font-weight: bold;
    }

    .message-content {
      margin-top: 4px;
      margin-bottom: 4px;
    }

    .message-date {
      font-size: 0.8em;
      color: var(--secondary-text-color);
    }
    `;
  }
}

customElements.define('inbox-card', InboxCard);
