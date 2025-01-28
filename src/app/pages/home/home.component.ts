import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PessoaServiceService } from '../../services/pessoa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pessoas: any[] = [];
  filteredNomes: string[] = [];
  private searchTerms = new Subject<string>();

  constructor(private pessoaService: PessoaServiceService) {}

  ngOnInit(): void {
    this.carregarPessoas();

    // Configura o debounce para o campo de pesquisa
    this.searchTerms.pipe(
      debounceTime(300), // Aguarda 300ms após a última digitação
      distinctUntilChanged() // Ignora se o termo não mudou
    ).subscribe(query => {
      this.filtrarNomes(query);
    });
  }

  carregarPessoas() {
    this.pessoaService.getAllPessoas().subscribe({
      next: (data) => {
        this.pessoas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar pessoas:', error);
      }
    });
  }

  onInputChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchTerms.next(query); // Envia o termo de pesquisa para o Subject
  }

  filtrarNomes(query: string) {
    if (query) {
      this.filteredNomes = this.pessoas
        .filter(pessoa => pessoa.nome.toLowerCase().includes(query))
        .map(pessoa => pessoa.nome)
        .slice(0, 3);

      if (this.filteredNomes.length === 0) {
        this.filteredNomes = ["não encontrado"];
      }
    } else {
      this.filteredNomes = [];
    }
  }

  selecionarNome(nome: string) {
    if (nome !== "não encontrado") {
      (document.getElementById('pesquisarNome') as HTMLInputElement).value = nome;
    }
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

    const pessoa = { nome, dataNasc, cpf, altura, peso, sexo };

    this.pessoaService.createPessoa(pessoa).subscribe({
      next: (response) => {
        document.getElementById('resultado')!.innerText = "Pessoa incluída com sucesso!";
        document.getElementById('erro')!.innerText = "";
        (document.getElementById('pessoaForm') as HTMLFormElement).reset();
        this.carregarPessoas(); // Recarrega a lista de pessoas
      },
      error: (error) => {
        console.error('Erro ao incluir pessoa:', error);
        document.getElementById('erro')!.innerText = "Erro ao incluir pessoa. Verifique os dados e tente novamente.";
      }
    });
  }

  pesquisar() {
    const nome = (document.getElementById('pesquisarNome') as HTMLInputElement).value;
    this.pessoaService.getPessoaByNome(nome).subscribe({
      next: (data) => {
        if (data) {
          this.pessoas = [data]; // Atualiza a lista de pessoas com o resultado da pesquisa
          this.filteredNomes = [data.nome];
        } else {
          this.filteredNomes = ["não encontrado"];
        }
      },
      error: (error) => {
        console.error('Erro ao pesquisar pessoa:', error);
        this.filteredNomes = ["não encontrado"];
      }
    });
  }
}
