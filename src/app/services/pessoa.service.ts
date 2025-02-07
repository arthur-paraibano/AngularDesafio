import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PessoaModel } from '../domain/models/PessoaModel';

@Injectable({
  providedIn: 'root'
})
export class PessoaServiceService {
  private baseUrl: string = "http://localhost:8080/cadastro";
  private pessoaDado: PessoaModel | any

  constructor(private http: HttpClient) {}

  getAllPessoas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getPessoaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/find/${id}`);
  }

  getPessoaByNome(nome: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/name/${nome}`);
  }

  createPessoa(pessoa: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add`, pessoa);
  }

  updatePessoa(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update/${id}`, value);
  }

  deletePessoa(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

  getPesoIdel(altura: number, genero: String) {
    return this.http.get(`${this.baseUrl}/peso-ideal/${altura}/${genero}`);
  }
}
