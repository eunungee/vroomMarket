import { LightningElement, wire, track } from 'lwc';
import getReinspectionsForNext14Days from '@salesforce/apex/InspectorCalendarController.getReinspectionsForNext14Days';

export default class InspectorCalendar extends LightningElement {
    @track leftColumnDates = [];
    @track rightColumnDates = [];

    @wire(getReinspectionsForNext14Days)
    wiredReinspections({ error, data }) {
        if (data) {
            const today = new Date();
            const allDates = [];
            for (let i = 0; i < 14; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);
                
                const reinspectionsForDay = data.filter(inspection => {
                    return new Date(inspection.Reinspection_Date__c).toDateString() === currentDate.toDateString();
                }).sort((a, b) => a.Reinspection_Time__c - b.Reinspection_Time__c); // 시간 순 정렬

                allDates.push({
                    id: i,
                    formattedDate: this.formatDate(currentDate),
                    reinspections: reinspectionsForDay.map(record => ({
                        id: record.Id,
                        time: this.msToTime(record.Reinspection_Time__c),
                        address: this.formatAddress(record.Reinspection_Location__c),
                        showTooltip: false
                    }))
                });
            }

            // 2열로 나눠서 날짜를 분배
            this.leftColumnDates = allDates.slice(0, 7);
            this.rightColumnDates = allDates.slice(7, 14);
        } else if (error) {
            console.error('Error fetching reinspections', error);
        }
    }

    formatDate(date) {
        return `${date.getMonth() + 1}/${date.getDate()}`; // MM/DD 형식
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
            const { city, state } = location;
            return `${state} ${city}`;
        }
        return '주소 정보 없음';
    }

    handleCircleClick(event) {
        const inspectionId = event.target.dataset.id;

        // 모든 tooltip을 숨기고 클릭된 것만 보여주기
        this.leftColumnDates = this.leftColumnDates.map(date => {
            date.reinspections = date.reinspections.map(inspection => {
                inspection.showTooltip = (inspection.id === inspectionId);
                return inspection;
            });
            return date;
        });

        this.rightColumnDates = this.rightColumnDates.map(date => {
            date.reinspections = date.reinspections.map(inspection => {
                inspection.showTooltip = (inspection.id === inspectionId);
                return inspection;
            });
            return date;
        });
    }
}