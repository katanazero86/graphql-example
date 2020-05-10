# graphql-example 프로젝트

> 그래프큐엘을 한번 사용해보고, 기존 REST 와 무엇이 다른지 느껴보자.


### project setting

```
1. graphql-yoga 
2. sqlite3
3. nodemon

graphql 관련 모듈 설치
npm i -S graphql-yoga

이거 말고
npm i -S graphql-express 
도 있으나.. 난 요가를 해볼거임

// express app start
npm run start

http://localhost:8000/

```

### graphQL

```
- REST 는 URI 에는 한가지 정보만을 반환(무언가 완성된 데이터를 얻으려면 URI를 하나 생성 또는 여러 URI 호출 후 데이터를 조합해야함)
- 그래프큐엘은 단일 호출로 원하는 정보를 얻어옴
- 그래프큐엘은 사상과 개념이고 이를 구현해서 사용하는게 graphql-yoga, graphql-express 같은 라이브러리들이 있다.
- REST 에서는 CRUD가 역할이 명확하게 나뉜반면에 그래프큐엘은 R을 제외한 모든 동작을 mutation 에서 처리한다.
(조회는 query, 나머지는 mutation)


type Members {
  name: String!
  email: String
}

type Query {
  getTeamMember: [Members!]!
}

Members : 오브젝트 타입
name, email : 필드
느낌표(!) : 필수 값을 의미(non-nullable)
대괄호([, ]) : 배열을 의미(array)

getTeamMember: [Members!]! => getTeamMember 는 null 될 수 없으며, 배열안에 ! 가 있는데 이는 최소 빈배열 준다는 의미 

```

```
query {
  person {
    user_id
    user_name
    user_password
  }
}

query	{
  info
}

mutation {
  createPerson(
    userName : "zero86"
    userPassword : "123456789"
  ) {
    user_id
    user_name
    user_password
  }
}


```



### 참조
- https://velog.io/@cadenzah/graphql-node-02-getting-started
- https://velog.io/@cadenzah/graphql-node-03-query
- https://velog.io/@cadenzah/graphql-node-04-mutation
