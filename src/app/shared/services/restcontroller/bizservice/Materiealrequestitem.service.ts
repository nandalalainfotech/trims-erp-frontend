import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "../../services/base.service";
import { Materiealrequestitem001wb } from "../entities/Materiealrequestitem001wb";



@Injectable()
export class MateriealrequestiteManager extends BaseService {
    private materiealrequestitemUrl: string = `${environment.apiUrl}/Materiealrequestitem`



    allmateriealrequest(unitslno:number) {
        let data: any = {};
        data['unitslno'] = unitslno;
        return this.getCallService(`${this.materiealrequestitemUrl}` + "/findAll",data);
    }
    
    findOne(id: any) {
        let data: any = {};
        data['id'] = id;
        return this.getCallService(`${this.materiealrequestitemUrl}`, data);
    }

    materiealrequestsave(materiealrequestitem001wb : Materiealrequestitem001wb ) {
    return this.postCallService(`${this.materiealrequestitemUrl}` + "/save", {}, materiealrequestitem001wb );
    }
  
    materiealrequestUpdate(materiealrequestitem001wb: Materiealrequestitem001wb) {
        return this.putCallService(`${this.materiealrequestitemUrl}` + "/update", {}, materiealrequestitem001wb);
    }
  

    materiealrequestDelete(id: any) {
        let data: any = {};
        data['id'] = id;
        return this.deleteCallService(`${this.materiealrequestitemUrl}` + "/delete", data);
    }

}