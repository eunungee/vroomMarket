import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class TestStartButton extends NavigationMixin(LightningElement) {
    navigateToPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ohanavroommarketcom-dev-ed.develop.my.site.com/TrainingTest/s/trainingtestpage'
            }
        });
    }

    handleMouseOver(event) {
        event.target.style.backgroundColor = 'rgb(39, 46, 64)';
        event.target.style.color = 'white';
    }

    handleMouseOut(event) {
        event.target.style.backgroundColor = 'white';
        event.target.style.color = 'rgb(39, 46, 64)';
    }
}