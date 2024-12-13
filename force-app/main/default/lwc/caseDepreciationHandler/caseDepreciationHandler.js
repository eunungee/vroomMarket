import { LightningElement, api, wire } from 'lwc';
import getOpportunityAmount from '@salesforce/apex/CaseDepreciationController.getOpportunityAmount';
import updateCaseDepreciation from '@salesforce/apex/CaseDepreciationController.updateCaseDepreciation';

export default class CaseDepreciationHandler extends LightningElement {
    @api recordId; // Opportunity의 Id가 전달됨
    opportunityAmount;
    isChecked = false;
    realAmount;

    // Opportunity의 Amount 필드를 가져옴
    @wire(getOpportunityAmount, { opptyId: '$recordId' })
    wiredOpportunity({ error, data }) {
        if (data) {
            this.opportunityAmount = data.Amount;
        } else if (error) {
            console.error('Error fetching opportunity data', error);
        }
    }

    // 체크박스 상태 변경 핸들러
    handleCheckboxChange(event) {
        this.isChecked = event.target.checked;
        const customEvent = new CustomEvent('valuechange', {
            detail: { value: this.isChecked }
        });
        this.dispatchEvent(customEvent);
    }

    // 실제 거래 금액 입력 필드 변경 핸들러
    handleRealAmountChange(event) {
        this.realAmount = event.target.value;
        const customEvent = new CustomEvent('valuechange', {
            detail: { value: this.realAmount }
        });
        this.dispatchEvent(customEvent);
    }
}