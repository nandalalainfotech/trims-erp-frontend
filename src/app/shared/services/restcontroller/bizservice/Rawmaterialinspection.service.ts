import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "../../services/base.service";
import { Rawmaterialinspection001wb } from "../entities/Rawmaterialinspection001wb";




@Injectable()
export class RawmaterialinspectionManager extends BaseService {
    private rawmaterialUrl: string = `${environment.apiUrl}/Rawmaterialinspection`



    allrawmaterial(unitslno:number) {
        let data: any = {};
        data['unitslno'] = unitslno;
        return this.getCallService(`${this.rawmaterialUrl}` + "/findAll", data);
    }
    findNotificationAll() {
        return this.getCallService(`${this.rawmaterialUrl}` + "/findNotificationAll");
    }
    
    findOne(id: any) {
        let data: any = {};
        data['id'] = id;
        return this.getCallService(`${this.rawmaterialUrl}`, data);
    }

    rawmaterialsave(rawmaterialinspection001wb : Rawmaterialinspection001wb ) {
    return this.postCallService(`${this.rawmaterialUrl}` + "/save", {}, rawmaterialinspection001wb );
    }
  
    rawmaterialUpdate(rawmaterialinspection001wb: Rawmaterialinspection001wb) {
        return this.putCallService(`${this.rawmaterialUrl}` + "/update", {}, rawmaterialinspection001wb);
    }
  

    rawmaterialDelete(id: any) {
        let data: any = {};
        data['id'] = id;
        return this.deleteCallService(`${this.rawmaterialUrl}` + "/delete", data);
    }

    
    itemPdf(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/itempdf", data)
    }
    iemExcel(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/itemexcel", data)
    }

    consumablePdf(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/consumablepdf", data)
    }
    consumableExcel(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/consumablexcel", data)
    }

    childPartPdf(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/childPartpdf", data)
    }
    childPartExcel(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/childPartexcel", data)
    }


    PartPdf(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/partpdf", data)
    }
    PartExcel(unitslno:any) {
        let data:any={};
        data['unitslno']=unitslno; 
        return this.getCallService1(`${this.rawmaterialUrl}` + "/partexcel", data)
    }

}