import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import PRODUCT_RECORD_ID from '@salesforce/schema/Product_Record__c.Product_Id__c'; // 마스터 디테일 필드 (차량 ID)
import MODEL_FIELD from '@salesforce/schema/Car__c.Model__c'; // 부모 오브젝트의 모델명 필드

export default class InspectionTitle extends LightningElement {
    carModel; // 차량 모델명 저장할 변수

    @wire(getRecord, { recordId: PRODUCT_RECORD_ID, fields: [MODEL_FIELD] })
    wiredVehicle({ error, data }) {
        if (data) {
            this.carModel = data.fields.Model__c.value; // 차량의 모델명을 carModel에 저장
        } else if (error) {
            console.error(error);
        }
    }
}