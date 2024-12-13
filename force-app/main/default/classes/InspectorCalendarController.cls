public with sharing class InspectorCalendarController {
    @AuraEnabled(cacheable=true)
    public static List<Partner_Visit__c> getReinspectionsForNext14Days() {
        Date today = Date.today();
        Date endDate = today.addDays(14);
        
        return [SELECT Id, Reinspection_Date__c, Reinspection_Time__c, Reinspection_Location__c 
                FROM Partner_Visit__c 
                WHERE Reinspection_Date__c >= :today AND Reinspection_Date__c <= :endDate];
    }
}