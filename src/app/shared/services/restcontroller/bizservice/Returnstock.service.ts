import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "../../services/base.service";
import { Returnstock001wb } from "../entities/Returnstock001wb";

@Injectable()
export class ReturnStockManager extends BaseService {
    private StockUrl: string = `${environment.apiUrl}/Returnstock`

    allStock(unitslno:number) {
        let data: any ={};
        data['unitslno'] =unitslno;
        return this.getCallService(`${this.StockUrl}` + "/findAll", data);
    }


    Stocksave(returnstock001wb: Returnstock001wb) {
        
        return this.postCallService(`${this.StockUrl}` + "/save", {}, returnstock001wb);
    }

    StockUpdate(returnstock001wb: Returnstock001wb) {
        return this.putCallService(`${this.StockUrl}` + "/update", {}, returnstock001wb);
    }

    StockDelete(id: any) {
        let data: any = {};
        data['id'] = id;
        return this.deleteCallService(`${this.StockUrl}` + "/delete", data);
    }

    itempdfId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/itempdf", data)
    }

    itemExcelId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/itemexcel", data)
    }

    consumpdfId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/consumpdf", data)
    }

    consumExcelId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/consumexcel", data)
    }

    cpartpdfId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/cpartpdf", data)
    }

    cpartExcelId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/cpartexcel", data)
    }

    partpdfId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/partpdf", data)
    }

    partExcelId(id: any,unitslno:any) {
        let data: any = {};
        data['id'] = id;
        data['unitdepartslNo']=unitslno;
        return this.getCallService1(`${this.StockUrl}` + "/partexcel", data)
    }
  
}