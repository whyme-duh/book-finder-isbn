import {useState} from 'react';
import {Container, Card, Typography, Button, CardContent, TextField} from '@mui/material';
import '../App.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import {Calendar, Building, Copy, Weight, ArrowRight, Star} from 'lucide-react';

function ScrapperView(){
    const [isbn, setIsbn] = useState("");
    const [bookData, setBookData] = useState("");
    const [error, setError] = useState("");

    const fetchBooks = async (e) =>{

        setBookData(null);
        setError(null);


        e.preventDefault(); 
        try{
            const response = await fetch(`https://backend-dry-log-7180.fly.dev/api/lookup/${isbn}/`);
            if(!response.ok){
                console.log("Book not foundd")
                setError("Book Not Found. Please enter the correct ISBN.")
                throw new Error("Network Error");
            }
            const data = await response.json();
            console.log("Django Response:", data);
            setBookData(data);
        }

        catch(e){
            console.log("Encounted some problem", e)
            setError("Error! Might be issues with API. Please try again later");
        }

    }

    return(
        <>
        
        <Container fixed sx={{
            width: { 
                xs: '100%', 
                md: '70%', 
                lg: '50%', 
                xl: '40%'}, 
            paddingTop:'10em'
            }}>
            <Typography variant='h1' className='header text-black' fontFamily={'Passion One'}>Book Scouter</Typography>
            <Typography variant='h5' className='sub-header' color='rgba(161, 161, 161, 1)' fontFamily={'monospace'}> Find any book with its <span className='isbn font-black text-black-950'>ISBN</span> number.</Typography>
            <Card sx={{border:'1px solid lightblue', marginTop:'2em', borderRadius:'10px'}}>
                <CardContent>
                    <form onSubmit={fetchBooks}>
                        <TextField 
                            slotProps={{
                            input:{
                                startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                            ),
                            endAdornment: (
                            <InputAdornment>
                                <Button sx={{backgroundColor:'lightblue', width:'100%', fontWeight:'700', }} type='submit'>Search</Button>
                            </InputAdornment>
                            ),
                            }
                        }}
                        label="ISBN" sx={{width:'100%', borderRadius: '5px', backgroundColor:'rgba(248, 248, 248, 1)'}} placeholder='"Ex: 9780140328721"'  value={isbn} onChange={(e)=> setIsbn(e.target.value)} className='isbnInput '/>
                    </form>
                </CardContent>
            </Card>
        </Container>
      
        {bookData && (
            <Container sx={{ width: { xs: '100%', 
                md: '70%', 
                lg: '50%', 
                xl: '40%'}, 
                paddingTop:{
                    xs:'1em',
                    md:'3em'
                } }} >
                <Card sx={{borderRadius:'1em'}} >
                    <CardContent sx={{
                        display:'flex',
                        flexDirection:{xs:'column', sm:'row'},
                        alignItems:{xs:'center'},
                        width: { xs: '100%', md: '100%' }}}>,
                        {bookData.cover_url ? 
                        <img src={bookData.cover_url} className='book-cover' alt='book-cover'/>
                        : <img src={bookData.img} className='book-cover' alt='book-cover'/>}
                        <Container sx={{textAlign:'left', marginTop:{xs:'2em'}}}>
                            <div className='book-header d-flex mb-5'>
                                <Typography variant='h4' fontWeight={'900'}>{bookData.title}</Typography>
                                <Typography variant='p' fontWeight={'900'} color='rgba(86, 198, 226, 1)'>{bookData.authors ? bookData.authors.map(author => author).join(',   ') : "Unknown Author"}</Typography>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Building className='w-5 md:w-4'/>    
                                    <span className="text-sm">
                                        <span className="font-medium text-slate-700">Publisher: </span> {bookData.publisher }
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Calendar className='w-5 md:w-4'/>
                                    <span className="text-sm">
                                        <span className="font-medium text-slate-700">Published On:</span> {bookData.published_date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Copy className='w-5 md:w-4'/>
                                    <span className="text-sm text-lg">
                                        <span className="font-medium text-slate-700">Page Count:</span> {bookData.number_of_pages ? bookData.number_of_pages : bookData.pagination}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Weight className='w-5 md:w-4'/>

                                    <span className="text-sm">
                                        <span className="font-medium text-slate-700">Weight:</span> {bookData.weight}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Star className='w-5 md:w-4'/>

                                    <span className="text-sm">
                                        <span className="font-medium text-slate-700">Goodreads Ratings:</span> {bookData.rating} {bookData.rating['img']}
                                    </span>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 mt-5'>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <span className="text-sm">
                                       <a href={`https://www.goodreads.com/search?q=${isbn}/`} className='text-blue-600 flex gap-2' >
                                        <Typography variant='p'>Check in Goodreads</Typography>
                                        <ArrowRight className='w-4'/>
                                       </a>
                                    </span>
                                    
                                </div>
                            </div>
                        </Container>
                    </CardContent>
                </Card>
            </Container>
        )}
        <Container sx={{width: { 
                xs: '100%', 
                md: '70%', 
                lg: '50%', 
                xl: '40%'},  
                paddingTop:{
                    xs:'1em',
                    md:'3em'
                }}}> 
            {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start gap-2">
            <div>
              <h3 className="text-red-800 text-start font-medium">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
        </Container>
        </>
    )
}



export default ScrapperView;