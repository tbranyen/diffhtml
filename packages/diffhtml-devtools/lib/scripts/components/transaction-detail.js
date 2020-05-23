import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';

class DevtoolsTransactionDetail extends WebComponent {
  static propTypes = {
    transaction: Object,
  }

  state = {
    activeTab: 'patches',
  }

  render() {
    const { setActive } = this;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui attached tabular menu">
        <div class="ui item ${activeTab === 'patches' && 'active'}">
          <a href="#" onClick=${setActive('patches')}>Patches</a>
        </div>

        <div class="ui item ${activeTab === 'diff' && 'active'}">
          <a href="#" onClick=${setActive('diff')}>Diff</a>
        </div>
      </div>

      <div class="ui styled fluid accordion">
        <div class="title">
          <i class="dropdown icon"></i>
          What is a dog?
        </div>
        <div class="content">
          <p class="transition hidden">A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
        </div>
        <div class="title">
          <i class="dropdown icon"></i>
          What kinds of dogs are there?
        </div>
        <div class="content">
          <p class="transition hidden">There are many breeds of dogs. Each breed varies in size and temperament. Owners often select a breed of dog that they find to be compatible with their own lifestyle and desires from a companion.</p>
        </div>
        <div class="title active">
          <i class="dropdown icon"></i>
          How do you acquire a dog?
        </div>
        <div class="content active">
          <p class="transition visible">Three common ways for a prospective owner to acquire a dog is from pet shops, private owners, or shelters.</p>
          <p class="transition visible">A pet shop may be the most convenient way to buy a dog. Buying a dog from a private owner allows you to assess the pedigree and upbringing of your dog before choosing to take it home. Lastly, finding your dog from a shelter, helps give a good home to a dog who may not find one so readily.</p>
        </div>
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
      }
    `;
  }

  setActive = activeTab => ev => {
    ev.preventDefault();
    this.setState({ activeTab });
  }
}

customElements.define('devtools-transaction-detail', DevtoolsTransactionDetail);
