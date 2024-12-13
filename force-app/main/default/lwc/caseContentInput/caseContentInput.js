import { LightningElement, api } from 'lwc';

export default class CaseContentInput extends LightningElement {
    @api caseContent = ''; // 입력받은 내용을 저장할 변수

    handleInputChange(event) {
        this.caseContent = event.target.value; // 입력 필드의 변경된 값을 저장
        const customEvent = new CustomEvent('valuechange', {
            detail: { value: this.caseContent }
        });
        this.dispatchEvent(customEvent);
    }
}