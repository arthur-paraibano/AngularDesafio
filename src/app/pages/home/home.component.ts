import { Component, OnInit } from '@angular/core';
import { PessoaServiceService } from '../../services/pessoa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pessoas: any[] = [];

  filteredNomes: string[] = [];

  constructor(private pessoaService: PessoaServiceService) {}

  ngOnInit(): void {
    this.pessoaService.getAllPessoas().subscribe({
      next: (res) => console.log(res)
      // next: (data) => {
      //   this.pessoas = data;
      //   this.preencherPesquisar();
      // }
      ,
      error: (error) => {
        console.error('Erro ao carregar pessoas:', error);
      }
    });
  }

  preencherPesquisar() {
    const nomes = this.pessoas.map(pessoa => pessoa.nome);
    this.filteredNomes = nomes;
  }

  onInputChange(event: any) {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.filteredNomes = this.pessoas
        .filter(pessoa => pessoa.nome.toLowerCase().includes(query))
        .map(pessoa => pessoa.nome)
        .slice(0, 3);
    } else {
      this.filteredNomes = [];
    }
  }

  selecionarNome(nome: string) {
    (document.getElementById('pesquisarNome') as HTMLInputElement).value = nome;
    this.filteredNomes = [];
  }

  incluir() {
    const nome = (document.getElementById('nome') as HTMLInputElement).value;
    const dataNasc = (document.getElementById('dataNasc') as HTMLInputElement).value;
    const cpf = (document.getElementById('cpf') as HTMLInputElement).value;
    const altura = parseFloat((document.getElementById('altura') as HTMLInputElement).value);
    const peso = parseFloat((document.getElementById('peso') as HTMLInputElement).value);
    const sexo = (document.getElementById('sexo') as HTMLSelectElement).value;

    if (!nome || !dataNasc || !cpf || !altura || !peso || !sexo) {
      document.getElementById('erro')!.innerText = "Preencha todos os campos!";
      return;
    }

    const pessoa = {
      nome,
      dataNasc,
      cpf,
      altura,
      peso,
      sexo
    };

    this.pessoaService.createPessoa(pessoa).subscribe({
      next: (response) => {
        document.getElementById('resultado')!.innerText = "Pessoa incluída com sucesso!";
        document.getElementById('erro')!.innerText = "";
        (document.getElementById('pessoaForm') as HTMLFormElement).reset();
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Erro ao incluir pessoa:', error);
        document.getElementById('erro')!.innerText = "Erro ao incluir pessoa. Verifique os dados e tente novamente.";
      }
    });
  }

  pesquisar() {
    const nome = (document.getElementById('pesquisarNome') as HTMLInputElement).value;
    const pessoa = { nome };
    this.pessoaService.getPessoaByNome(nome);
  }
}
