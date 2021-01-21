import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';

class DevtoolsTransactionDetail extends WebComponent {
  static propTypes = {
    transaction: Object,
    stats: Object,
    closeDetail: Function,
  }

  state = {
    activeTab: 'patches',
  }

  render() {
    const { transaction, stats, closeDetail } = this.props;
    const { activeTab } = this.state;
    const { setActive } = this;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui attached tabular menu">
        <i class="ui icon close" onClick=${closeDetail} />

        <div class="ui item ${activeTab === 'patches' && 'active'}">
          <a href="#" onClick=${setActive('patches')}>
            Patches
            <span class="ui teal label">${String(transaction.args.patches.length)}</span>
          </a>
        </div>

        <div class="ui item ${activeTab === 'diff' && 'active'}">
          <a href="#" onClick=${setActive('diff')}>Diff</a>
        </div>
      </div>

      <div class="ui bottom attached tab segment ${activeTab === 'patches' && 'active'}">
        <div class="ui styled fluid accordion">
          <div class="title">
            <i class="dropdown icon"></i>
            What is a dog?
          </div>
          <div class="content">
            <p class="transition hidden">A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
          </div>
          <div class="content active">
            <p class="transition visible">Three common ways for a prospective owner to acquire a dog is from pet shops, private owners, or shelters.</p>
            <p class="transition visible">A pet shop may be the most convenient way to buy a dog. Buying a dog from a private owner allows you to assess the pedigree and upbringing of your dog before choosing to take it home. Lastly, finding your dog from a shelter, helps give a good home to a dog who may not find one so readily.</p>
          </div>
        </div>
      </div>

      <div class="ui bottom attached tab segment ${activeTab === 'diff' && 'active'}">
        <devtools-vtree vTree=${transaction.args.state.oldTree} />
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        user-select: none;
        border-top: 2px solid #DEDEDE;
      }

      :host(.inverted) {
        border-top: 2px solid #424242;
      }

      .ui.close {
        padding: 15px;
        cursor: pointer;
      }

      .ui.tab.attached {
        overflow-y: auto;
      }

      .ui.styled.accordion {
        border-top: none;
        box-shadow: none;
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-transaction-detail', DevtoolsTransactionDetail);
