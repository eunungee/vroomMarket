public with sharing class CaseContactController {
    @AuraEnabled(cacheable=true)
    public static Contact getContactFromCase(Id caseId) {
        Opportunity oppty;
        Quote quote;
        Contact contact;

        try {
            // Case에서 Opportunity_ID__c 가져오기
            oppty = [SELECT SyncedQuoteId FROM Opportunity WHERE Id IN (SELECT Opportunity_ID__c FROM Case WHERE Id = :caseId) LIMIT 1];

            if (oppty == null || oppty.SyncedQuoteId == null) {
                throw new AuraHandledException('연결된 Opportunity 또는 Quote가 없습니다.');
            }

            // SyncedQuote에서 연결된 Contact 가져오기
            quote = [SELECT ContactId FROM Quote WHERE Id = :oppty.SyncedQuoteId LIMIT 1];

            if (quote == null || quote.ContactId == null) {
                throw new AuraHandledException('연결된 Quote 또는 Contact가 없습니다.');
            }

            // Contact 정보 반환
            contact = [SELECT Id, Name, Email, Phone, Title FROM Contact WHERE Id = :quote.ContactId LIMIT 1];
            return contact;

        } catch (Exception e) {
            throw new AuraHandledException('오류 발생: ' + e.getMessage());
        }
    }
}