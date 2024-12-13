import { LightningElement, api, track } from 'lwc';
import carInside from '@salesforce/resourceUrl/Inside';
import carOutside from '@salesforce/resourceUrl/Outside';
import createRecord from '@salesforce/apex/CreateProductRecordController.createRecord';
import recordDetailController from '@salesforce/apex/RecordDetailController.readRecordDetail';
import uploadFilesToRecord from '@salesforce/apex/FileUploader.uploadFilesToRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CarInspectionForm extends LightningElement {
    CarInside = carInside;
    CarOutside = carOutside;
    @track opptyId;
    @track recordId;
    @track error;
    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);

        this.opptyId = urlParams.get('opptyId');

        recordDetailController({OpptyId: this.opptyId})
            .then(result => {
                this.recordId = result.Id;
                console.log('Record ID:', this.recordId);
                this.error = undefined;
            })
            .catch(error => {
                this.error = 'Error fetching record fields: ' + error.body.message;
                this.recordId = undefined;
            })
    }

    @track carKeyCount = 0;
    @track paintingCount = 0;
    @track wheelScratchCount = 0;
    @track frontTireWear = 0;
    @track rearTireWear = 0;
    @track specialKey = false;
    @track selectedIssues = [];
    @track showInputField = false;

    @track DLight = false;
    @track OpError = false;
    @track OLeak = false;
    @track DD = false;

    handleCheckChangeDlight(event) {
        this.DLight = event.target.checked;
    }
    handleCheckChangeOpError(event) {
        this.OpError = event.target.checked;
    }
    handleCheckChangeOLeak(event) {
        this.OLeak = event.target.checked;
    }
    handleCheckChangeDD(event) {
        this.DD = event.target.checked;
    }

    @track fieldList = [
        {id: 'Bonnetbtn', style: 'top: 163px; left: 254px;', dataField: 'BonnetField', title: '본넷', divId: 'BonnetDiv', value: 0, showField: false },
        {id: 'RFFenderbtn', style: 'top: 167px; left: 326px;', dataField: 'RFFenderField', title: '오른쪽 앞휀더', divId: 'RFFenderDiv', value: 0, showField: false},
        {id: 'LFFenderbtn', style: 'top: 167px; left: 181px;', dataField: 'LFFenderField', title: '왼쪽 앞휀더', divId: 'LFFenderDiv', value: 0, showField: false},
        {id: 'RFDoorbtn', style: 'top: 212px; left: 330px;', dataField: 'RFDoorField', title: '오른쪽 앞도어', divId: 'RFDoorDiv', value: 0, showField: false},
        {id: 'LFDoorbtn', style: 'top: 212px; left: 175px;', dataField: 'LFDoorField', title: '왼쪽 앞도어', divId: 'LFDoorDiv', value: 0, showField: false},
        {id: 'RBDoorbtn', style: 'top: 250px; left: 330px;', dataField: 'RBDoorField', title: '오른쪽 뒷도어', divId: 'RBDoorDiv', value: 0, showField: false},
        {id: 'LBDoorbtn', style: 'top: 250px; left: 179px;', dataField: 'LBDoorField', title: '왼쪽 뒷도어', divId: 'LBDoorDiv', value: 0, showField: false},
        {id: 'TDoorbtn', style: 'top: 310px; left: 254px;', dataField: 'TDoorField', title: '트렁크 도어', divId: 'TDoorDiv', value: 0, showField: false},
        {id: 'FPanelbtn', style: 'top: 498px; left: 254px;', dataField: 'FPanelField', title: '프론트 패널', divId: 'FPanelDiv', value: 0, showField: false},
        {id: 'LFInsidePanelbtn', style: 'top: 516px; left: 227px;', dataField: 'LFInsidePanelField', title: '왼쪽 앞 인사이드 패널', divId: 'LFInsidePanelDiv', value: 0, showField: false},
        {id: 'RFInsidePanelbtn', style: 'top: 516px; left: 281px;', dataField: 'RFInsidePanelField', title: '오른쪽 앞 인사이드 패널', divId: 'RFInsidePanelDiv', value: 0, showField: false},
        {id: 'LFWHousebtn', style: 'top: 536px; left: 227px;', dataField: 'LFWHouseField', title: '왼쪽 앞 휠하우스', divId: 'LFWHouseDiv', value: 0, showField: false},
        {id: 'RFWHousebtn', style: 'top: 536px; left: 281px;', dataField: 'RFWHouseField', title: '오른쪽 앞 휠하우스', divId: 'RFWHouseDiv', value: 0, showField: false},
        {id: 'LSideMemberbtn', style: 'top: 530px; left: 245px;', dataField: 'LSideMemberField', title: '왼쪽 사이드 멤버', divId: 'LSideMemberDiv', value: 0, showField: false},
        {id: 'RSideMemberbtn', style: 'top: 530px; left: 264px;', dataField: 'RSideMemberField', title: '오른쪽 사이드 멤버', divId: 'RSideMemberDiv', value: 0, showField: false},
        {id: 'CrossMemberbtn', style: 'top: 557px; left: 254px;', dataField: 'CrossMemberField', title: '크로스 멤버', divId: 'CrossMemberDiv', value: 0, showField: false},
        {id: 'RoofPanelbtn', style: 'top: 585px; left: 254px;', dataField: 'RoofPanelField', title: '루프 패널', divId: 'RoofPanelDiv', value: 0, showField: false},
        {id: 'LBWHousebtn', style: 'top: 614px; left: 230px;', dataField: 'LBWHouseField', title: '왼쪽 뒤 휠하우스', divId: 'LBWHouseDiv', value: 0, showField: false},
        {id: 'RBWHousebtn', style: 'top: 614px; left: 278px;', dataField: 'RBWHouseField', title: '오른쪽 뒤 휠하우스', divId: 'RBWHouseDiv', value: 0, showField: false},
        {id: 'LBInsidePanelbtn', style: 'top: 635px; left: 230px;', dataField: 'LBInsidePanelField', title: '왼쪽 뒤 인사이드 패널', divId: 'LBInsidePanelDiv', value: 0, showField: false},
        {id: 'RBInsidePanelbtn', style: 'top: 635px; left: 278px;', dataField: 'RBInsidePanelField', title: '오른쪽 뒤 인사이드 패널', divId: 'RBInsidePanelDiv', value: 0, showField: false},
        {id: 'TrunkFloorbtn', style: 'top: 635px; left: 254px;', dataField: 'TrunkFloorField', title: '트렁크 플로어', divId: 'TrunkFloorDiv', value: 0, showField: false},
        {id: 'RearPanelbtn', style: 'top: 654px; left: 254px;', dataField: 'RearPanelField', title: '리어 패널', divId: 'RearPanelDiv', value: 0, showField: false},
        {id: 'RPillarbtn', style: 'top: 580px; left: 203px;', dataField: 'RPillarField', title: '오른쪽 필러류', divId: 'RPillarDiv', value: 0, showField: false},
        {id: 'LPillarbtn', style: 'top: 580px; left: 304px;', dataField: 'LPillarField', title: '왼쪽 필러류', divId: 'LPillarDiv', value: 0, showField: false},
        {id: 'RSSPanelbtn', style: 'top: 565px; left: 158px;', dataField: 'RSSPanelField', title: '오른쪽 사이드실 패널', divId: 'RSSPanelDiv', value: 0, showField: false},
        {id: 'LSSPanelbtn', style: 'top: 565px; left: 349px;', dataField: 'LSSPanelField', title: '왼쪽 사이드실 패널', divId: 'LSSPanelDiv', value: 0, showField: false},
        {id: 'RBFenderbtn', style: 'top: 645px; left: 183px;', dataField: 'RBFenderField', title: '오른쪽 뒤 휀더', divId: 'RBFenderDiv', value: 0, showField: false},
        {id: 'LBFenderbtn', style: 'top: 645px; left: 323px;', dataField: 'LBFenderField', title: '왼쪽 뒤 휀더', divId: 'LBFenderDiv', value: 0, showField: false}
]

    handleCheckChange(event) {
        const field = event.target.dataset.field;
        const fieldData = this.fieldList.find(f => f.dataField === field);
        if (fieldData) {
            fieldData.showField = event.target.checked;
        }

        if (event.target.checked) {
            const targetDiv = this.template.querySelector(`#${fieldData.divId}`);
            if (targetDiv) {
                targetDiv.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    handleCheckChangeImg(event) {
        this.showInputField = event.target.checked;
    }

    handleCheckChangeSpecialKey(event) {
        this.specialKey = event.target.checked;
    }

    incrementField(event) {
        const field = event.target.dataset.field;
        const fieldData = this.fieldList.find(f => f.dataField === field);
        if (fieldData && fieldData.value < 100) {
            fieldData.value += 1;
        }
    }

    decrementField(event) {
        const field = event.target.dataset.field;
        const fieldData = this.fieldList.find(f => f.dataField === field);
        if (fieldData && fieldData.value > 0) {
            fieldData.value -= 1;
        }
    }

    incrementCarKeyCount() {
        this.carKeyCount += 1;
    }

    decrementCarKeyCount() {
        if (this.carKeyCount > 0) {
            this.carKeyCount -= 1;
        }
    }

    incrementPaintingCount() {
        this.paintingCount += 1;
    }

    decrementPaintingCount() {
        if (this.paintingCount > 0) {
            this.paintingCount -= 1;
        }
    }

    incrementWheelScratchCount() {
        this.wheelScratchCount += 1;
    }

    decrementWheelScratchCount() {
        if (this.wheelScratchCount > 0) {
            this.wheelScratchCount -= 1;
        }
    }

    incrementFrontTireWear() {
        if (this.frontTireWear < 100) {
            this.frontTireWear += 1;
        }
    }

    decrementFrontTireWear() {
        if (this.frontTireWear > 0) {
            this.frontTireWear -= 1;
        }
    }

    incrementRearTireWear() {
        if (this.rearTireWear < 100) {
            this.rearTireWear += 1;
        }
    }

    decrementRearTireWear() {
        if (this.rearTireWear > 0) {
            this.rearTireWear -= 1;
        }
    }

    handleRadioChange(event) {
        this.specialKey = event.detail.value;
    }

    handleCheckboxChange(event) {
        this.selectedIssues = event.detail.value;
    }

    @track Unfair = false;

    handleCheckChangeSubmit(event) {
        this.Unfair = event.target.checked;
    }

    @api recordId2;

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpg', '.jpeg'];
    }

    @track uploadedFiles = [];

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.uploadedFiles = uploadedFiles.map(file => file.documentId);
        let uploadedFileNames = '';
        for (let i = 0; i < uploadedFiles.length; i++) {
            uploadedFileNames += uploadedFiles[i].name + ', ';
        }
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: uploadedFiles.length + ' Files uploaded Successfully: ' + uploadedFileNames,
                variant: 'success',
            })
        );
    }

    uploadRelatedFiles(recordId) {
    // Apex 호출로 파일을 레코드와 연동
    uploadFilesToRecord({ recordId: recordId, fileIds: this.uploadedFiles })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Files successfully linked to record!',
                    variant: 'success',
                })
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error linking files to record: ' + (error.body ? error.body.message : error.message),
                    variant: 'error',
                })
            );
        })
    }

    submitInspection() {
        console.log('버튼 누름');

        // wrapper 생성
        try {
            const wrapper = {
                KeyCount: this.carKeyCount || 0,
                SpecialKey: this.specialKey || false,
                Painting: this.paintingCount || 0,
                WheelScratch: this.wheelScratchCount || 0,
                FTireAbrasion: this.frontTireWear || 0,
                BTireAbrasion: this.rearTireWear || 0,
                Bonnet: this.fieldList.find(f => f.dataField === 'BonnetField')?.showField || false,
                LFFender: this.fieldList.find(f => f.dataField === 'LFFenderField')?.showField || false,
                RFFender: this.fieldList.find(f => f.dataField === 'RFFenderField')?.showField || false,
                LFDoor: this.fieldList.find(f => f.dataField === 'LFDoorField')?.showField || false,
                RFDoor: this.fieldList.find(f => f.dataField === 'RFDoorField')?.showField || false,
                LBDoor: this.fieldList.find(f => f.dataField === 'LBDoorField')?.showField || false,
                RBDoor: this.fieldList.find(f => f.dataField === 'RBDoorField')?.showField || false,
                TDoor: this.fieldList.find(f => f.dataField === 'TDoorField')?.showField || false,
                TFloor: this.fieldList.find(f => f.dataField === 'TFloorField')?.showField || false,
                FrontPanel: this.fieldList.find(f => f.dataField === 'FPanelField')?.showField || false,
                LFInsidePanel: this.fieldList.find(f => f.dataField === 'LFInsidePanelField')?.showField || false,
                RFInsidePanel: this.fieldList.find(f => f.dataField === 'RFInsidePanelField')?.showField || false,
                LBInsidePanel: this.fieldList.find(f => f.dataField === 'LBInsidePanelField')?.showField || false,
                RBInsidePanel: this.fieldList.find(f => f.dataField === 'RBInsidePanelField')?.showField || false,
                LFWHouse: this.fieldList.find(f => f.dataField === 'LFWHouseField')?.showField || false,
                RFWHouse: this.fieldList.find(f => f.dataField === 'RFWHouseField')?.showField || false,
                LSMember: this.fieldList.find(f => f.dataField === 'LSideMemberField')?.showField || false,
                RSMember: this.fieldList.find(f => f.dataField === 'RSideMemberField')?.showField || false,
                CrossMember: this.fieldList.find(f => f.dataField === 'CrossMemberField')?.showField || false,
                RoofPanel: this.fieldList.find(f => f.dataField === 'RoofPanelField')?.showField || false,
                LBWHouse: this.fieldList.find(f => f.dataField === 'LBWHouseField')?.showField || false,
                RBWHouse: this.fieldList.find(f => f.dataField === 'RBWHouseField')?.showField || false,
                RearPanel: this.fieldList.find(f => f.dataField === 'RearPanelField')?.showField || false,
                LPillar: this.fieldList.find(f => f.dataField === 'LPillarField')?.showField || false,
                RPillar: this.fieldList.find(f => f.dataField === 'RPillarField')?.showField || false,
                LSSPanel: this.fieldList.find(f => f.dataField === 'LSSPanelField')?.showField || false,
                RSSPanel: this.fieldList.find(f => f.dataField === 'RSSPanelField')?.showField || false,
                LBFender: this.fieldList.find(f => f.dataField === 'LBFenderField')?.showField || false,
                RBFender: this.fieldList.find(f => f.dataField === 'RBFenderField')?.showField || false,
                numLFFender: this.fieldList.find(f => f.dataField === 'LFFenderField')?.value || 0,
                numLFDoor: this.fieldList.find(f => f.dataField === 'LFDoorField')?.value || 0,
                numLBDoor: this.fieldList.find(f => f.dataField === 'LBDoorField')?.value || 0,
                numBonnet: this.fieldList.find(f => f.dataField === 'BonnetField')?.value || 0,
                numTDoor: this.fieldList.find(f => f.dataField === 'TDoorField')?.value || 0,
                numRFFender: this.fieldList.find(f => f.dataField === 'RFFenderField')?.value || 0,
                numRFDoor: this.fieldList.find(f => f.dataField === 'RFDoorField')?.value || 0,
                numRBDoor: this.fieldList.find(f => f.dataField === 'RBDoorField')?.value || 0,
                numLPillar: this.fieldList.find(f => f.dataField === 'LPillarField')?.value || 0,
                numLSSPanel: this.fieldList.find(f => f.dataField === 'LSSPanelField')?.value || 0,
                numLBFender: this.fieldList.find(f => f.dataField === 'LBFenderField')?.value || 0,
                numFrontPanel: this.fieldList.find(f => f.dataField === 'FPanelField')?.value || 0,
                numLFInsidePanel: this.fieldList.find(f => f.dataField === 'LFInsidePanelField')?.value || 0,
                numLFWHouse: this.fieldList.find(f => f.dataField === 'LFWHouseField')?.value || 0,
                numLSMember: this.fieldList.find(f => f.dataField === 'LSideMemberField')?.value || 0,
                numRFInsidePanel: this.fieldList.find(f => f.dataField === 'RFInsidePanelField')?.value || 0,
                numRFWHouse: this.fieldList.find(f => f.dataField === 'RFWHouseField')?.value || 0,
                numRSMember: this.fieldList.find(f => f.dataField === 'RSideMemberField')?.value || 0,
                numCrossMember: this.fieldList.find(f => f.dataField === 'CrossMemberField')?.value || 0,
                numRoofPanel: this.fieldList.find(f => f.dataField === 'RoofPanelField')?.value || 0,
                numLBWHouse: this.fieldList.find(f => f.dataField === 'LBWHouseField')?.value || 0,
                numLBInsidePanel: this.fieldList.find(f => f.dataField === 'LBInsidePanelField')?.value || 0,
                numTFloor: this.fieldList.find(f => f.dataField === 'TFloorField')?.value || 0,
                numRBWHouse: this.fieldList.find(f => f.dataField === 'RBWHouseField')?.value || 0,
                numRBInsidePanel: this.fieldList.find(f => f.dataField === 'RBInsidePanelField')?.value || 0,
                numRearPanel: this.fieldList.find(f => f.dataField === 'RearPanelField')?.value || 0,
                numRPillar: this.fieldList.find(f => f.dataField === 'RPillarField')?.value || 0,
                numRSSPanel: this.fieldList.find(f => f.dataField === 'RSSPanelField')?.value || 0,
                numRBFender: this.fieldList.find(f => f.dataField === 'RBFenderField')?.value || 0,
                DLight: this.DLight,
                OpError: this.OpError,
                OilLeak: this.OLeak,
                DriveDisturb: this.DD,
                Unfair_Deal: this.Unfair,
                OpptyId: this.opptyId || null
            };


            console.log('opptyId in connectedCallback:', wrapper.OpptyId); // 확인용
            createRecord({ wrapper })
                .then(result => {
                    if (result) {
                        this.recordId2 = result;  // 생성된 레코드의 ID 저장
                        console.log('Record created successfully: ', this.recordId2);
                        
                        // 파일이 업로드된 경우 처리
                        if (this.uploadedFiles.length > 0 && this.recordId2) {
                            this.uploadRelatedFiles(this.recordId2);
                        }

                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Inspection record created successfully!',
                                variant: 'success',
                            })
                        );
                        window.location.href = 'https://ohanavroommarketcom-dev-ed.develop.my.site.com/inspector/s/';
                    } else {
                        console.error('Record creation failed, result is null.');
                        throw new Error('Record creation failed: result is null.');
                    }
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Error creating inspection record: ' + (error.body ? error.body.message : error.message),
                            variant: 'error',
                        })
                    );
                    console.error('Error creating record:', error);
                });
        } catch (error) {
            console.error('Error while creating wrapper:', error);
        }
    }

    @track isModalOpen = false;

    handleGetRecordDetails() {
        if (this.recordId) {
            this.isModalOpen = true;
            console.log('Opening modal with Record ID:', this.recordId); // Debugging Log
        } else {
            this.error = 'Record ID is missing';
            console.log('Record ID is missing'); // Debugging Log
        }
    }

    // 모달 닫기
    closeModal() {
        this.isModalOpen = false; // 모달 닫기
    }
}