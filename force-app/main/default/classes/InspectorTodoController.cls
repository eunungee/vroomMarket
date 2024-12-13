public with sharing class InspectorTodoController {
    @AuraEnabled(cacheable=true)
    public static List<Partner_Visit__c> getTodayReinspections(/*String userId*/) {
        Date today = Date.today();
        // User partner = [SELECT ContactId FROM User WHERE Id = :userId LIMIT 1];
        List<Partner_Visit__c> parVisits = [SELECT Id, Reinspection_Time__c, Reinspection_Location__c, Status__c, Related_Oppty__c
                                                FROM Partner_Visit__c 
                                                WHERE Reinspection_Date__c = :today /*AND Vistor__c = :partner.ContactId*/];
        return parVisits;
    }
}