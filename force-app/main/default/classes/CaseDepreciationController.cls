public with sharing class CaseDepreciationController {
    @AuraEnabled(cacheable=true)
    public static Opportunity getOpportunityAmount(Id opptyId) {
        // Opportunity 레코드에서 금액 정보 가져오기
        Opportunity opportunity = [SELECT Amount FROM Opportunity WHERE Id = :opptyId LIMIT 1];
        return opportunity;
    }

    @AuraEnabled
    public static void updateCaseDepreciation(Id caseId, Boolean isChecked, Decimal realAmount) {
        Case caseRecord = [SELECT Id, Check_amount_of_depreciation__c, Real_amount_of_depreciation__c FROM Case WHERE Id = :caseId LIMIT 1];
        caseRecord.Check_amount_of_depreciation__c = isChecked;
        if (isChecked) {
            caseRecord.Real_amount_of_depreciation__c = realAmount;
        } else {
            caseRecord.Real_amount_of_depreciation__c = null;
        }
        update caseRecord;
    }
}