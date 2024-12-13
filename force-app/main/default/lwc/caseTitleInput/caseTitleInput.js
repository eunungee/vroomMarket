import { LightningElement, api } from 'lwc';

export default class CaseTitleInput extends LightningElement {
    @api caseTitle = ''; // 입력받은 제목을 저장할 변수

    handleInputChange(event) {
        this.caseTitle = event.target.value; // 입력 필드의 변경된 값을 저장
        const customEvent = new CustomEvent('valuechange', {
            detail: { value: this.caseTitle }
        });
        this.dispatchEvent(customEvent);
    }
}