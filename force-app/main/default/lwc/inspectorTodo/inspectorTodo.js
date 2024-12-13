import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getTodayReinspections from '@salesforce/apex/InspectorTodoController.getTodayReinspections';
import userId from '@salesforce/user/Id'; 

export default class InspectorTodo extends NavigationMixin(LightningElement) {
    reinspectionRecords = [];
    // currentUserId = userId;

    @wire(getTodayReinspections/*, {Id: '$currentUserId'}*/)
    wiredReinspections({ error, data }) {
        if (data) {
            this.reinspectionRecords = data.map(record => {
                const time = this.msToTime(record.Reinspection_Time__c);
                const address = this.formatAddress(record.Reinspection_Location__c);
                const isCompleted = record.Status__c === 'Completed';
                return {
                    Id: record.Id,
                    timeValue: record.Reinspection_Time__c,
                    buttonLabel: `${time} - ${address}`,
                    buttonClass: isCompleted ? 'slds-button-completed' : 'slds-button-custom',
                    isCompleted: isCompleted,
                    opportunityId: record.Related_Oppty__c // 관련 거래 내역 필드 추가
                };
            }).sort((a, b) => a.timeValue - b.timeValue);
        } else if (error) {
            console.error('Error fetching reinspections', error);
        }
    }

    msToTime(s) {
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
        let hrs = (s - mins) / 60;
        hrs = hrs < 10 ? '0' + hrs : hrs;
        mins = mins < 10 ? '0' + mins : mins;
        return `${hrs}시 ${mins}분`;
    }

    formatAddress(location) {
        if (location) {
            const { street, city, state, postalCode } = location;
            return `${state} ${city} ${street} ${postalCode}`;
        }
        return '주소 정보 없음';
    }

    handleReinspectionClick(event) {
        const reinspectionId = event.target.dataset.id;
        const record = this.reinspectionRecords.find(record => record.Id === reinspectionId);

        if (record && record.opportunityId) {
            // URL에 관련 거래 내역 (Oppty) ID를 추가하여 이동
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `https://ohanavroommarketcom-dev-ed.develop.my.site.com/inspector/s/inspect-page?opptyId=${record.opportunityId}`  // Opportunity ID 추가
                }
            });
        } else {
            console.error('Related Opportunity ID가 없습니다.');
        }
    }
}